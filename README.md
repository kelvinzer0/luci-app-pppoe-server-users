# luci-app-pppoe-users

LuCI web interface for managing PPPoE Server user accounts (`/etc/ppp/chap-secrets`) on OpenWrt / ImmortalWrt.

Ported and packaged for **ALL Architectures** (`Architecture: all` / `x86_64`, `aarch64`, `mips_24kc`, `mipsel_24kc`, `arm_cortex-a7`, etc.).

---

## Features

- **LuCI Web Management:** Add, edit, and delete PPPoE user accounts directly in LuCI under **Services → PPPoE Accounts**.
- **Universal Compatibility:** Pure Lua and JavaScript implementation with no CPU-specific binaries.
- **Auto Service Reload:** Automatically updates `/etc/ppp/chap-secrets` and syncs with `rp-pppoe-server`.

---

## Installation

### 1. Download the latest IPK
Download the `.ipk` from the [Releases](https://github.com/kelvinzer0/luci-app-pppoe-users/releases/latest) page.

### 2. Install on OpenWrt / ImmortalWrt
Transfer the `.ipk` to your router via SCP, then run:

```bash
opkg update
opkg install rp-pppoe-server
opkg install luci-app-pppoe-users_1.0.0-1_all.ipk
/etc/init.d/rpcd restart
/etc/init.d/uhttpd restart
```

---

## Manual Build

To build the universal `.ipk` package manually:

```bash
chmod +x build.sh
./build.sh
```

The output packages will be placed in the `bin/` directory.

---

## Credits
Based on the original work by [akosiramnad/OpenWrt-PPPoE-Server-Account-Manager](https://github.com/akosiramnad/OpenWrt-PPPoE-Server-Account-Manager).

---

## License
MIT License
