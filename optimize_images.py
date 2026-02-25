"""
POLYMedia - Optimizador de Imagenes para Web
Apex Image Compression Engine v1.0
- Redimensiona: max 1920px de ancho
- Convierte PNG a JPEG
- Calidad JPEG: 82%
- Guarda originales en /renders/originals/
"""
import os
import sys
import shutil
from pathlib import Path
from PIL import Image

# Forzar stdout en UTF-8 para evitar UnicodeEncodeError en Windows
sys.stdout.reconfigure(encoding='utf-8')

# Config
RENDERS_DIR  = Path("assets/img/renders")
BACKUP_DIR   = RENDERS_DIR / "originals"
MAX_WIDTH    = 1920
JPEG_QUALITY = 82
VALID_EXTS   = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}


def format_bytes(b):
    for unit in ["B", "KB", "MB", "GB"]:
        if b < 1024:
            return f"{b:.1f} {unit}"
        b /= 1024
    return f"{b:.1f} GB"


def optimize(src: Path) -> dict:
    original_size = src.stat().st_size
    img = Image.open(src)

    # Convertir a RGB si es necesario
    if img.mode in ("RGBA", "P", "LA", "L"):
        img = img.convert("RGB")
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Redimensionar si supera MAX_WIDTH
    w, h = img.size
    if w > MAX_WIDTH:
        new_h = int(h * MAX_WIDTH / w)
        img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)
        print(f"  Redimensionado: {w}x{h} -> {MAX_WIDTH}x{new_h}")

    # Siempre guardar como .jpeg
    out_path = src.with_suffix(".jpeg")
    img.save(out_path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

    # Si el original era .png o .jpg (no .jpeg), borrar el original
    if src != out_path and src.exists():
        src.unlink()

    new_size = out_path.stat().st_size
    saved    = original_size - new_size
    pct      = (saved / original_size * 100) if original_size else 0

    return {
        "original": src.name,
        "output"  : out_path.name,
        "before"  : original_size,
        "after"   : new_size,
        "saved"   : saved,
        "pct"     : pct,
    }


def main():
    print("\n" + "="*55)
    print("  POLYMedia - Optimizador de Imagenes para Web")
    print("="*55 + "\n")

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    images = sorted([
        f for f in RENDERS_DIR.iterdir()
        if f.is_file()
        and f.suffix.lower() in VALID_EXTS
        and f.parent == RENDERS_DIR
    ])

    if not images:
        print("No se encontraron imagenes en:", RENDERS_DIR)
        return

    total_before = 0
    total_after  = 0

    for img_path in images:
        print(f"\n[{img_path.name}]")

        # Backup
        backup_path = BACKUP_DIR / img_path.name
        if not backup_path.exists():
            shutil.copy2(img_path, backup_path)
            print(f"  Backup: OK")

        try:
            result = optimize(img_path)
            total_before += result["before"]
            total_after  += result["after"]

            print(f"  Antes  : {format_bytes(result['before'])}")
            print(f"  Despues: {format_bytes(result['after'])}")
            print(f"  Ahorro : {format_bytes(result['saved'])} ({result['pct']:.0f}%)")
            print(f"  Output : {result['output']}")

        except Exception as e:
            print(f"  ERROR: {e}")

    total_saved = total_before - total_after
    total_pct   = (total_saved / total_before * 100) if total_before else 0

    print("\n" + "="*55)
    print(f"  TOTAL ANTES  : {format_bytes(total_before)}")
    print(f"  TOTAL DESPUES: {format_bytes(total_after)}")
    print(f"  AHORRO TOTAL : {format_bytes(total_saved)} ({total_pct:.0f}%)")
    print(f"  Originales   : assets/img/renders/originals/")
    print("="*55 + "\n")


if __name__ == "__main__":
    main()
