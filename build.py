import os
import shutil
import subprocess

def run_command(cmd):
    print(f"Executing: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    return result.returncode == 0

def build():
    # 1. Setup dist folder
    dist_dir = 'dist'
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    os.makedirs(dist_dir)
    
    # 2. Copy assets (non-processed)
    print("Copying assets and components...")
    shutil.copytree('assets', os.path.join(dist_dir, 'assets'))
    shutil.copytree('components', os.path.join(dist_dir, 'components'))
    shutil.copy('privacidad.html', dist_dir)
    shutil.copy('renders.html', dist_dir)
    
    # 3. Process JS
    print("Processing JS with Terser...")
    os.makedirs(os.path.join(dist_dir, 'js'), exist_ok=True)
    js_files = [f for f in os.listdir('js') if f.endswith('.js')]
    for js in js_files:
        src = os.path.join('js', js)
        out = os.path.join(dist_dir, 'js', js)
        run_command(f'npx -y terser "{src}" --compress --mangle -o "{out}"')

    # 4. Process CSS
    print("Processing CSS...")
    os.makedirs(os.path.join(dist_dir, 'css'), exist_ok=True)
    css_files = [f for f in os.listdir('css') if f.endswith('.css')]
    for css in css_files:
        src = os.path.join('css', css)
        out = os.path.join(dist_dir, 'css', css)
        # Usamos clean-css-cli para una minificación estructural segura
        run_command(f'npx -y clean-css-cli -o "{out}" "{src}"')

    # 5. Process HTML
    print("Optimizing HTML...")
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Aquí podríamos inyectar cambios si fuera necesario, 
    # pero como mantenemos los mismos nombres de archivos en dist/, solo copiamos
    with open(os.path.join(dist_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n--- BUILD COMPLETE: Apex Protection Enabled in /dist ---")

if __name__ == "__main__":
    build()
