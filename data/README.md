# 数据

## `device.json`

设备型号列表，需要手动编辑。数据来源：[ipsw.me](https://ipsw.me) 及 [TheiPhoneWiki](https://theiphonewiki.com)。

## `image.yml`

设备官方图示，需要手动编辑。数据来源：[Apple Support](https://support.apple.com)。

## `jailbreak.json`

越狱状态，由 `parse_jailbreak.py` 从 `jailbreak.xlsx` 生成。其中，`jailbreak.xlsx` 可参见 https://www.kdocs.cn/l/sz2WiBDRj 。

## `model.json`

设备型号-标识符对应表，由 `parse_anum.py` 从 `model.mediawiki` 生成。此数据并不完全正确（因为存在一个 A-型号对应不同的标识符的可能），所以慎重用于其它场合。

## `model-alter.json`

设备标识符-内置型号对应表。比较详细，但难于使用。