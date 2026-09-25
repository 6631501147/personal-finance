$dir = "C:\Users\acer\.gemini\antigravity-ide\scratch\Finance\backend"
New-Item -Path $dir -ItemType Directory -Force
Set-Location -Path $dir
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon

New-Item -Path "$dir\src\controllers" -ItemType Directory -Force
New-Item -Path "$dir\src\routes" -ItemType Directory -Force
New-Item -Path "$dir\src\services" -ItemType Directory -Force
New-Item -Path "$dir\src\middleware" -ItemType Directory -Force
New-Item -Path "$dir\src\config" -ItemType Directory -Force

$pkg = Get-Content package.json | ConvertFrom-Json
$pkg | Add-Member -MemberType NoteProperty -Name "type" -Value "module"
$pkg.scripts | Add-Member -MemberType NoteProperty -Name "start" -Value "node src/app.js" -Force
$pkg.scripts | Add-Member -MemberType NoteProperty -Name "dev" -Value "nodemon src/app.js" -Force
$pkg | ConvertTo-Json -Depth 10 | Out-File package.json -Encoding utf8
