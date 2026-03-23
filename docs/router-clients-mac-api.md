# Aggregate Command API (Client List & MAC Filter)

The Ruijie router API uses a `cmdArr` method to securely batch multiple operations (RPC requests) into a single HTTP POST request. This greatly improves performance when querying multiple datasets at once.

This specific example retrieves the real-time **Connected Client List** alongside the **Wireless MAC Filter Configuration**.

## Endpoint
**POST** `/cgi-bin/luci/api/cmd`

### Query Parameters
- `auth`: The authorization token (e.g., `?auth=fb0a300c31872328806ab9beb71f3363`).

## Request

### Headers
- `Content-Type: application/json`

### Body (JSON)
The body uses the `cmdArr` method. The physical array of commands is nested inside `params.params`.

```json
{
  "method": "cmdArr",
  "params": {
    "device": "pc",
    "params": [
      {
        "method": "devSta.get",
        "params": {
          "module": "user_list",
          "noParse": true,
          "async": null,
          "remoteIp": false,
          "data": {
            "devType": "all",
            "dataType": "timely"
          }
        }
      },
      {
        "method": "acConfig.get",
        "params": {
          "module": "wirelessMacFilter",
          "noParse": false,
          "async": null,
          "remoteIp": false
        }
      }
    ]
  }
}
```

## Response

A successful request returns the `data` payload structured as an **Array**, where each index corresponds directly to the results of the command requested at that same index. 

For instance, `data[0]` is the result of `devSta.get` (User List) and `data[1]` is the result of `acConfig.get` (MAC filtering rules).

### Example Response
```json
{
    "code": 0,
    "id": null,
    "error": null,
    "data": [
        // Result [0]: User List (devSta.get)
        {
            "code": "0",
            "list": [
                {
                    "mac": "c0:f8:53:fc:fc:ae",
                    "userIp": "192.168.110.100",
                    "name": "smart-plug",
                    "connectType": "wireless",
                    "ssid": "ToE",
                    "band": "2.4G",
                    "onlinetime": "2026-03-20 15:40:00",
                    "rssi": "-95",
                    "rxrate": "6M",
                    "up": "24358601",
                    "down": "1192173",
                    ...
                },
                ...
            ],
            "total": "9"
        },
        // Result [1]: Wireless MAC Filter Config (acConfig.get)
        {
            "type": "deny",
            "networkId": "dev_58:B4:BB:48:A6:05_1737715326",
            "groupId": "0",
            ...
            "macList": [
                {
                    "mac": "4A:2C:EA:2A:D4:DD",
                    "name": "OPPO-A18"
                },
                ...
            ],
            "axMacList": []
        }
    ]
}
```

### Data Fields Description

**Result 0: User List (`devSta.get` -> `user_list`)**
- `total`: Total number of connected clients.
- `list`: Array containing the network clients.
  - `mac`: Physical MAC address of the device.
  - `userIp`: Assigned local IPv4 address.
  - `name` / `hostName`: Custom device alias or broadcasting hostname.
  - `connectType`: `wireless` or `wire` (Ethernet).
  - `band`: The wireless band used (e.g. `2.4G` or `5G`).
  - `rssi`: The wireless signal strength (lower negative numbers are better).
  - `rxrate`: The negotiated wireless link speed.
  - `up` / `down`: Physical bytes uploaded and downloaded by the client.

**Result 1: MAC Filter Config (`acConfig.get` -> `wirelessMacFilter`)**
- `type`: `deny` (blacklist mode) or `allow` (whitelist mode/disabled).
- `macList`: Array of objects detailing the currently blocked (or specifically allowed) MAC addresses.
