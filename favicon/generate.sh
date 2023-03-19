#!/bin/sh

SOURCE="favicon.svg"
ICON_PATH="../public/img/icons"

# favicon.ico
inkscape -w 16 -h 16 --export-filename 16.png ${SOURCE}
inkscape -w 32 -h 32 --export-filename 32.png ${SOURCE}
inkscape -w 48 -h 48 --export-filename 48.png ${SOURCE}
convert 16.png 32.png 48.png ../public/favicon.ico
rm 16.png 32.png 48.png

# Favicon png
inkscape -w 16 -h 16 --export-filename ${ICON_PATH}/favicon-16x16.png ${SOURCE}
inkscape -w 32 -h 32 --export-filename ${ICON_PATH}/favicon-32x32.png ${SOURCE}

# Android/Chrome
inkscape -w 192 -h 192 --export-filename ${ICON_PATH}/android-chrome-192x192.png ${SOURCE}
inkscape -w 512 -h 512 --export-filename ${ICON_PATH}/android-chrome-512x512.png ${SOURCE}
inkscape -w 192 -h 192 --export-area=-4:-4:36:36 --export-filename ${ICON_PATH}/android-chrome-maskable-192x192.png ${SOURCE}
inkscape -w 512 -h 512 --export-area=-4:-4:36:36 --export-filename ${ICON_PATH}/android-chrome-maskable-512x512.png ${SOURCE}

# Apple touch
inkscape -w 60 -h 60 -y 1 --export-filename ${ICON_PATH}/apple-touch-icon-60x60.png ${SOURCE}
inkscape -w 76 -h 76 -y 1 --export-filename ${ICON_PATH}/apple-touch-icon-76x76.png ${SOURCE}
inkscape -w 120 -h 120 -y 1 --export-filename ${ICON_PATH}/apple-touch-icon-120x120.png ${SOURCE}
inkscape -w 152 -h 152 -y 1 --export-filename ${ICON_PATH}/apple-touch-icon-152x152.png ${SOURCE}
inkscape -w 180 -h 180 -y 1 --export-filename ${ICON_PATH}/apple-touch-icon-180x180.png ${SOURCE}
cp ${ICON_PATH}/apple-touch-icon-180x180.png ${ICON_PATH}/apple-touch-icon.png

# MS Application Icon
inkscape -w 144 -h 144 -y 1 --export-filename ${ICON_PATH}/msapplication-icon-144x144.png ${SOURCE}
inkscape -w 150 -h 150 --export-area=-12:-4:44:52 --export-filename ${ICON_PATH}/mstile-150x150.png ${SOURCE}
