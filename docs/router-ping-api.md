# System Ping API

This API endpoint executes a network ping from the Ruijie router to check internet connectivity and measure latency metrics (min, avg, max, and packet loss).

## Endpoint
**POST** `/cgi-bin/luci/api/system`

### Query Parameters
- `auth`: The authorization token (e.g., `?auth=fb0a300c31872328806ab9beb71f3363`). Just like the overview API, this is required to authorize the request if cookies aren't being evaluated natively.

## Request

### Headers
- `Content-Type: application/json`

### Body (JSON)
The body sends an RPC request calling the `ping` method with no additional target parameters (which defaults to pinging the router's DNS/WAN target).

```json
{
  "method": "ping",
  "params": null
}
```

## Response

A successful request returns a JSON object where the `data` field contains a **stringified JSON string** with the actual ping metrics. You will need to parse the `data` string explicitly (`JSON.parse(response.data)`) to access the metrics object.

### Example Response
```json
{
    "code": 0,
    "id": null,
    "data": "{\"ping\":{\"min\":9.602,\"num\":1,\"avg\":9.602,\"loss\":0,\"max\":9.602,\"time\":1774260364}}",
    "error": null
}
```

### Data Fields Description
After parsing the stringified `data` field, the resulting `ping` object contains:
- `min`: Float, minimum ping latency in milliseconds
- `max`: Float, maximum ping latency in milliseconds
- `avg`: Float, average ping latency in milliseconds
- `loss`: Integer, packet loss count or percentage (e.g., `0` means zero packets lost)
- `num`: Integer, the number of ICMP packets sent for the test (e.g., `1`)
- `time`: Integer (Unix Epoch timestamp), the time the ping test was performed
