# Device Status Overview API

This API endpoint retrieves real-time statistics and overview data from the Ruijie router, including active connection count, bandwidth rates, device status, and uptime.

## Endpoint
**POST** `/cgi-bin/luci/api/cmd`

### Query Parameters
- `auth`: The authorization token (e.g., `?auth=fb0a300c31872328806ab9beb71f3363`). This might also alternatively be passed via cookies depending on the session logic.

## Request

### Headers
- `Content-Type: application/json;charset=UTF-8`

### Body (JSON)
The body specifies the RPC method and parameters required to fetch the overview module.

```json
{
  "method": "devSta.get",
  "params": {
    "module": "overview",
    "noParse": false,
    "async": null,
    "remoteIp": false,
    "device": "pc"
  }
}
```

## Response

A successful request returns a JSON object containing the `data` payload with various telemetry fields.

### Example Response
```json
{
    "code": 0,
    "id": null,
    "error": null,
    "data": {
        "conntrack_max": 8192,
        "uptime": 0,
        "showgame": "1",
        "online_users": 9,
        "mtkhnat": "0",
        "conntrack_count": 162,
        "study": "off",
        "runtime": 602296,
        "game": "off",
        "cpuutil": "5%",
        "flowctrl": "1",
        "status": "connected",
        "up_rate": 4395,
        "rcgame_enabled": "true",
        "down_rate": 3580
    }
}
```

### Data Fields Description
- `status`: String, connection status of the router (e.g., target WAN connection)
- `online_users`: Integer, number of devices currently connected
- `cpuutil`: String, CPU utilization percentage
- `up_rate`: Integer, current upload bandwidth rate
- `down_rate`: Integer, current download bandwidth rate
- `conntrack_count` / `conntrack_max`: Connection tracking connections
- `runtime`: Integer, time the router has been running
