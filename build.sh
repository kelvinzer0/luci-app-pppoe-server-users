#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_NAME="luci-app-pppoe-users"
PKG_VERSION="${PKG_VERSION:-1.0.0}"
PKG_RELEASE="${PKG_RELEASE:-1}"
BUILD_DIR="${SCRIPT_DIR}/build"
OUTPUT_DIR="${SCRIPT_DIR}/bin"

echo "Building ${PKG_NAME}_${PKG_VERSION}-${PKG_RELEASE}_all.ipk..."

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}/data/www" "${BUILD_DIR}/data/usr" "${BUILD_DIR}/control" "${OUTPUT_DIR}"

# 1. Populate data
cp -r "${SCRIPT_DIR}/htdocs/"* "${BUILD_DIR}/data/www/"
cp -r "${SCRIPT_DIR}/root/"* "${BUILD_DIR}/data/"

chmod 755 "${BUILD_DIR}/data/usr/libexec/rpcd/luci.poe"

# 2. Control file
cat << EOF > "${BUILD_DIR}/control/control"
Package: ${PKG_NAME}
Version: ${PKG_VERSION}-${PKG_RELEASE}
Depends: rp-pppoe-server
Provides: pppoeuser
Section: luci
Maintainer: kelvinzer0
Architecture: all
Description: LuCI support for PPPoE Server User Accounts management (All Architectures)
EOF

# 3. Postinst and Prerm scripts
cat << 'EOF' > "${BUILD_DIR}/control/postinst"
#!/bin/sh
[ "${IPKG_NO_SCRIPT}" = "1" ] && exit 0
[ -x /etc/init.d/rpcd ] && /etc/init.d/rpcd restart
[ -x /etc/init.d/uhttpd ] && /etc/init.d/uhttpd restart
exit 0
EOF
chmod 755 "${BUILD_DIR}/control/postinst"

cat << 'EOF' > "${BUILD_DIR}/control/prerm"
#!/bin/sh
exit 0
EOF
chmod 755 "${BUILD_DIR}/control/prerm"

# 4. Pack debian-binary, data.tar.gz, control.tar.gz
echo "2.0" > "${BUILD_DIR}/debian-binary"

cd "${BUILD_DIR}/data"
tar -czf ../data.tar.gz .

cd "${BUILD_DIR}/control"
tar -czf ../control.tar.gz .

IPK_FILE="${OUTPUT_DIR}/${PKG_NAME}_${PKG_VERSION}-${PKG_RELEASE}_all.ipk"
cd "${BUILD_DIR}"
tar -czf "${IPK_FILE}" ./debian-binary ./data.tar.gz ./control.tar.gz

# Also generate a compatibility alias pppoeuser_all.ipk
cp "${IPK_FILE}" "${OUTPUT_DIR}/pppoeuser_${PKG_VERSION}-${PKG_RELEASE}_all.ipk"

echo "SUCCESS! Created:"
echo "  -> ${IPK_FILE}"
echo "  -> ${OUTPUT_DIR}/pppoeuser_${PKG_VERSION}-${PKG_RELEASE}_all.ipk"
