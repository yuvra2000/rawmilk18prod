---
name: api-endpoint
description: 'Create new API endpoints with service methods, component integration, FormData payloads, and error handling. Use when adding new backend API calls, creating service methods, integrating API responses in components.'
argument-hint: 'API endpoint name or description'
---

# API Endpoint Creation

Create complete API integrations following the project's patterns: service method creation, FormData payload construction, component integration, and error handling with toast notifications.

## When to Use

- Adding a new API endpoint to an existing or new service
- Integrating API calls into Angular components  
- Creating FormData payloads for POST requests
- Implementing error handling with AlertService toasts
- Following the MasterRequestService pattern

## Project Patterns

### 1. Service Method Structure

Services extend the `MasterRequestService` pattern and use FormData for API calls:

```typescript
import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YourService {
  constructor(private masterRequest: MasterRequestService) { }

  yourMethodName(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/your-endpoint', payload);
  }
}
```

### 2. FormData Payload Creation

Use the `createFormData` utility from `src/app/shared/utils/shared-utility.utils.ts`:

```typescript
import { createFormData } from '@shared/utils/shared-utility.utils';

// In your component
const payload = createFormData(this.token, {
  FromDate: fromDate,
  ToDate: toDate,
  ForWeb: '1',
  Plant: String(formData?.plant?.id || formData?.plant?.entity_id || ''),
  DispatchLoc: String(
    formData?.dispatchLocation?.id || formData?.dispatchLocation?.entity_id || ''
  ),
  Status: status,
});
```

**Key points:**
- First parameter: `this.token` (usually from component or localStorage)
- Second parameter: Plain object with string values
- Use `String()` wrapper for numeric or nullable values
- Handle nested properties with optional chaining and fallbacks

### 3. Component Integration

```typescript
export class YourComponent {
  token: string = localStorage.getItem('AccessToken') || '';

  constructor(
    private yourService: YourService,
    private alertService: AlertService
  ) {}

  loadData(formData: any) {
    const payload = createFormData(this.token, {
      // your parameters
    });

    this.yourService.yourMethodName(payload).subscribe({
      next: (response) => {
        if (response.Status === 'success' || response.status === 1) {
          this.alertService.success(response.Message || 'Success');
          // Handle success data
        } else {
          this.alertService.error(response.Message || 'Operation failed');
        }
      },
      error: (error) => {
        this.alertService.error('An error occurred');
        console.error('API Error:', error);
      }
    });
  }
}
```

### 4. Error Handling Pattern

Always handle both success/failure status AND HTTP errors:

```typescript
.subscribe({
  next: (response) => {
    // Check API status field
    const status = response.Status || response.status;
    if (status === 'success' || status === 1) {
      this.alertService.success(response.Message || 'Success');
      // Process data
    } else {
      this.alertService.error(response.Message || 'Operation failed');
    }
  },
  error: (error) => {
    // Handle HTTP errors (network, 500, etc.)
    this.alertService.error(error.message || 'An error occurred');
    console.error('API Error:', error);
  }
});
```

## Implementation Procedure

### Step 1: Create or Update Service

1. If service doesn't exist, create new file: `src/app/components/[module]/[name].service.ts`
2. Inject `MasterRequestService` in constructor
3. Create method that accepts `FormData` and returns `Observable<any>`
4. Use `this.masterRequest.postFormData(endpoint, payload)` for POST requests
5. Use `this.masterRequest.get<T>(endpoint, params)` for GET requests

### Step 2: Build FormData Payload in Component

1. Import `createFormData` from shared utils
2. Ensure `token` is available (from localStorage or component property)
3. Create payload object with all required parameters as strings
4. Handle optional/nullable values with fallbacks: `String(value || '')`
5. Use optional chaining for nested properties: `formData?.plant?.id`

### Step 3: Integrate in Component

1. Inject the service in component constructor
2. Inject `AlertService` for toast notifications
3. Call service method with payload
4. Subscribe to Observable with `next` and `error` handlers
5. Check response status field (`Status` or `status`)
6. Show success/error toasts via AlertService
7. Process response data on success

### Step 4: Type Safety (Optional but Recommended)

Define response interfaces for better type safety:

```typescript
interface ApiResponse<T> {
  Status?: string;
  status?: number;
  Message?: string;
  message?: string;
  Data?: T;
  data?: T;
}

yourMethod(payload: FormData): Observable<ApiResponse<YourDataType>> {
  return this.masterRequest.postFormData<ApiResponse<YourDataType>>(
    '/endpoint',
    payload
  );
}
```

## Common Patterns

### MasterRequestService Methods Available

- `postFormData<T>(endpoint, payload)` - POST with FormData
- `post<T>(endpoint, payload)` - POST with JSON
- `get<T>(endpoint, params)` - GET with query params
- `put<T>(endpoint, payload)` - PUT request
- `patch<T>(endpoint, payload)` - PATCH request  
- `delete<T>(endpoint, params)` - DELETE request

### Token Management

Token is typically stored in localStorage and passed to `createFormData`:

```typescript
token: string = localStorage.getItem('AccessToken') || '';
```

### String Conversion

Always convert to strings for FormData:

```typescript
Plant: String(plantId || ''),
Status: String(statusValue || ''),
IsActive: String(isActive ? '1' : '0'),
```

### Nested Property Access

Use optional chaining with multiple fallbacks:

```typescript
Plant: String(formData?.plant?.id || formData?.plant?.entity_id || ''),
```

## Checklist

- [ ] Service file exists and imports MasterRequestService
- [ ] Service method accepts FormData parameter
- [ ] Component imports createFormData utility
- [ ] Token is available (from localStorage or component)
- [ ] All payload values converted to strings
- [ ] Nullable values have fallbacks
- [ ] AlertService injected in component
- [ ] Subscribe handles both `next` and `error`
- [ ] Response status checked (Status/status field)
- [ ] Success and error toasts displayed
- [ ] Console.error for debugging errors

## Examples

### Example 1: Report API

**Service:**
```typescript
getMpcTripReport(payload: FormData): Observable<any> {
  return this.masterRequest.postFormData('/rm_mpcTReport', payload);
}
```

**Component:**
```typescript
loadReport(filters: any) {
  const payload = createFormData(this.token, {
    FromDate: filters.fromDate,
    ToDate: filters.toDate,
    ForWeb: '1',
    Plant: String(filters.plant?.id || ''),
    Status: filters.status || 'all',
  });

  this.reportService.getMpcTripReport(payload).subscribe({
    next: (response) => {
      if (response.Status === 'success') {
        this.alertService.success('Report loaded');
        this.reportData = response.Data;
      } else {
        this.alertService.error(response.Message);
      }
    },
    error: (error) => {
      this.alertService.error('Failed to load report');
      console.error(error);
    }
  });
}
```

### Example 2: Master Data API

**Service:**
```typescript
getIndentMasterDetails(payload: FormData): Observable<any> {
  return this.masterRequest.postFormData('/createIndentMaster', payload);
}
```

**Component:**
```typescript
fetchMasterData(indentId: number) {
  const payload = createFormData(this.token, {
    IndentId: String(indentId),
    ForWeb: '1',
  });

  this.masterService.getIndentMasterDetails(payload).subscribe({
    next: (response) => {
      if (response.status === 1) {
        this.masterData = response.data;
        this.alertService.success('Data loaded successfully');
      } else {
        this.alertService.error(response.message || 'Failed to load');
      }
    },
    error: (error) => {
      this.alertService.error('Error loading master data');
      console.error('Master data error:', error);
    }
  });
}
```

## Tips

- **Token management**: Store token as component property or fetch from localStorage each time
- **Date formatting**: Format dates before creating payload (e.g., 'YYYY-MM-DD')
- **Boolean values**: Convert to '1'/'0' strings for API compatibility
- **Empty values**: Use empty string `''` instead of null/undefined
- **Endpoint naming**: Use kebab-case or snake_case as per API convention
- **Loading states**: Set loading flag before API call, clear in subscribe handlers
- **Response structure**: API responses may use `Status`/`status` and `Message`/`message` - handle both
