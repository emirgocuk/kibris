const BASE_URL = import.meta.env.VITE_API_ENDPOINT

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    isFormData?: boolean;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, isFormData = false } = options;

    const finalHeaders: Record<string, string> = { ...headers };
    let finalBody: any = body;

    if (!isFormData) {
        finalHeaders['Content-Type'] = 'application/json';
        finalBody = body ? JSON.stringify(body) : undefined;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: finalHeaders,
        body: finalBody,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

// GET fonksiyonu
export async function get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, { method: 'GET', headers });
}

// POST fonksiyonu
export async function post<T>(endpoint: string, body: any, options?: { headers?: Record<string, string>; isFormData?: boolean }): Promise<T> {
    return request<T>(endpoint, { method: 'POST', body, headers: options?.headers, isFormData: options?.isFormData });
}


// PUT fonksiyonu
export async function put<T>(
    endpoint: string,
    body: any,
    options?: { headers?: Record<string, string>; isFormData?: boolean }
): Promise<T> {
    // DOĞRU
    return request<T>(endpoint, {
        method: 'PUT',
        body,
        headers: options?.headers,
        isFormData: options?.isFormData
    });
}

// DELETE fonksiyonu
export async function del<T>(
    endpoint: string,
    headers?: Record<string, string>
): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE', headers });
}
