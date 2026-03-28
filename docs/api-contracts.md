# API Contracts

## API Structure

This Next.js application provides the following API endpoints via the `/app/api/` directory.

## Endpoints

### Index Management

#### GET `/api/index`
Retrieves the current index or list of indexed items.

**Response:**
```json
{
  "status": "success",
  "data": []
}
```

### Shot Management

#### GET `/api/shot/:id`
Retrieves a specific shot by ID.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "name": "string",
    "details": {}
  }
}
```

#### POST `/api/shot`
Creates a new shot record.

**Request Body:**
```json
{
  "name": "string",
  "details": {}
}
```

**Response:**
```json
{
  "status": "success",
  "id": "string"
}
```

### Shots Collection

#### GET `/api/shots`
Retrieves all shots.

**Query Parameters:**
- `limit` (optional) - Number of results to return
- `offset` (optional) - Number of results to skip

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "name": "string",
      "details": {}
    }
  ]
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
