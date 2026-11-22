include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for PPPoE SERVER User Accounts (chap-secrets)
LUCI_DEPENDS:=+rp-pppoe-server
LUCI_PKGARCH:=all
PKG_NAME:=luci-app-pppoe-server-users
PKG_VERSION:=1.0.1
PKG_RELEASE:=1

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
