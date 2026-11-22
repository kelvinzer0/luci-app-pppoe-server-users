# luci-app-pppoe-server-users

<p align="center">
  <img src="https://raw.githubusercontent.com/akosiramnad/OpenWrt-PPPoE-Server-Account-Manager/main/sample.png" alt="PPPoE Server User Manager Preview" width="700"/>
</p>

<p align="center">
  <a href="https://github.com/kelvinzer0/luci-app-pppoe-server-users/releases/latest"><img src="https://img.shields.io/github/v/release/kelvinzer0/luci-app-pppoe-server-users?color=blue&style=for-the-badge" alt="Release"></a>
  <img src="https://img.shields.io/badge/Architecture-ALL-success?style=for-the-badge" alt="Architecture All">
  <img src="https://img.shields.io/badge/OpenWrt-21.x%20%7C%2022.x%20%7C%2023.x%20%7C%2024.x-informational?style=for-the-badge" alt="OpenWrt Versions">
  <img src="https://img.shields.io/badge/ImmortalWrt-Compatible-orange?style=for-the-badge" alt="ImmortalWrt">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
</p>

---

> [!IMPORTANT]
> **This is for PPPoE SERVER (Access Concentrator) user management, NOT for PPPoE Client.**
> Use this plugin when your OpenWrt / ImmortalWrt router is acting as a **PPPoE Server** (e.g. for RT-RW Net, ISP emulation, or lab environments) to manage subscriber credentials in `/etc/ppp/chap-secrets`.

---

## ✨ Features

- **🌐 Web GUI Management:** Create, view, edit, and delete PPPoE subscriber credentials right inside the LuCI web interface (**Services → PPPoE Server Accounts**).
- **🖥️ Universal CPU Compatibility (`Architecture: all`):** Pure Lua and JavaScript implementation. No architecture-specific binaries! Works out of the box on:
  - `x86_64` (Mini PC, Proxmox, VMware, x86 routers)
  - `aarch64` / `arm64` (Raspberry Pi 4/5, NanoPi, Banana Pi)
  - `mips_24kc` / `mipsel_24kc` (MediaTek MT7621, MT7628, Atheros, TP-Link)
  - `arm_cortex-a7` / `arm_cortex-a9`
- **🔄 Auto Sync:** Automatically writes changes to `/etc/ppp/chap-secrets` and restarts LuCI services without requiring a router reboot.
- **🛡️ Built-in RPCD ACL:** Configured with clean OpenWrt access control permissions.

---

## 🚀 Quick Installation

### Option 1: One-liner on OpenWrt / ImmortalWrt (Recommended)

SSH into your router and run:

```bash
opkg update
opkg install rp-pppoe-server wget-ssl
wget -O /tmp/luci-app-pppoe-server-users.ipk https://github.com/kelvinzer0/luci-app-pppoe-server-users/releases/latest/download/luci-app-pppoe-server-users_1.0.1-1_all.ipk
opkg install /tmp/luci-app-pppoe-server-users.ipk
/etc/init.d/rpcd restart
/etc/init.d/uhttpd restart
```

### Option 2: Download manually from GitHub Releases

1. Go to the [Releases](https://github.com/kelvinzer0/luci-app-pppoe-server-users/releases/latest) page.
2. Download `luci-app-pppoe-server-users_1.0.1-1_all.ipk`.
3. Upload it to your router via SCP / WinSCP:
   ```bash
   scp luci-app-pppoe-server-users_1.0.1-1_all.ipk root@192.168.1.1:/tmp/
   ```
4. Install it:
   ```bash
   opkg update && opkg install rp-pppoe-server
   opkg install /tmp/luci-app-pppoe-server-users_1.0.1-1_all.ipk
   ```

---

## 🛠️ Where to Find in LuCI

1. Open your browser and navigate to your router's LuCI interface (e.g. `http://192.168.1.1`).
2. Log in with your admin credentials.
3. In the top navigation menu, go to:
   **Services** $\rightarrow$ **PPPoE Server Accounts**

---

## 🏗️ Building from Source

To build the universal `.ipk` on your own machine:

```bash
git clone https://github.com/kelvinzer0/luci-app-pppoe-server-users.git
cd luci-app-pppoe-server-users
chmod +x build.sh
./build.sh
```

Generated packages will be saved in the `bin/` directory.

---

## 🤝 Credits & Acknowledgements

- Original concept by [akosiramnad/OpenWrt-PPPoE-Server-Account-Manager](https://github.com/akosiramnad/OpenWrt-PPPoE-Server-Account-Manager).
- Enhanced, sanitized, and ported to **All-Architecture** by [kelvinzer0](https://github.com/kelvinzer0).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
