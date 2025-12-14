#@title Build Callbreak APK (fresh)
!sudo apt-get update -qq
!sudo apt-get install -y -qq python3-pip python3-setuptools git zip unzip openjdk-11-jdk zlib1g-dev autoconf automake libtool pkg-config
!pip install --quiet buildozer Cython==0.29.36 virtualenv

from google.colab import files
import os, shutil, subprocess, pathlib

# Upload callbreak-colab.zip (fresh export from workspace)
uploaded = files.upload()
zip_name = next(iter(uploaded), None)
if not zip_name:
    raise SystemExit("Upload callbreak-colab.zip")

# Fresh workspace
if os.path.exists("workspace"):
    shutil.rmtree("workspace")
os.makedirs("workspace", exist_ok=True)

!unzip -q "{zip_name}" -d workspace

# Change to the workspace directory directly. It appears the zip extracts contents
# directly into 'workspace' rather than 'workspace/callbreak'.
os.chdir("workspace")

# Clean any previous build outputs (optional: comment out to reuse cache)
shutil.rmtree(".buildozer", ignore_errors=True)
shutil.rmtree("bin", ignore_errors=True)

# Build debug APK
!buildozer android debug

# Download first APK if present
apk_files = !ls bin/*.apk
print("APKs:", apk_files)
if apk_files:
    files.download(apk_files[0])