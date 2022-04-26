class HttpException extends Error {
  public readonly message: string;

  public readonly status: number;

  public readonly displayMessage: string;

  constructor(
    message: string,
    status: number,
    displayMessage: string = "Erro"
  ) {
    super(message);
    this.message = message;
    this.status = status;
    this.displayMessage = displayMessage;
  }
}

export default HttpException;
