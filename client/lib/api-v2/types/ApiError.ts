export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data: any;
  public errors: Record<string, string[]> | null;

  constructor(status: number, statusText: string, data: any) {
    super(data?.message || statusText);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.errors = data?.errors || null;
  }

  getValidationErrors(): string[] {
    if (!this.errors) return [];
    return Object.values(this.errors).flat();
  }
}
