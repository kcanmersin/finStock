using Microsoft.AspNetCore.Http;
using Serilog;
using System.IO;
using System.Text;
using System.Threading.Tasks;

public class RequestResponseLoggingMiddleware
{
    //exception handling middleware
    private readonly RequestDelegate _next;

    public RequestResponseLoggingMiddleware(RequestDelegate next)
    {
        _next = next;//sonraki middleware
    }

    public async Task InvokeAsync(HttpContext context)
    {
        context.Request.EnableBuffering();
        var requestBody = await new StreamReader(context.Request.Body).ReadToEndAsync();
        Log.Information("****MiddleWare**** Incoming request: {Method} {Path} {Body}", context.Request.Method, context.Request.Path, requestBody);
        context.Request.Body.Position = 0;

        var originalBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        await _next(context);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var responseBodyText = await new StreamReader(context.Response.Body).ReadToEndAsync();
        context.Response.Body.Seek(0, SeekOrigin.Begin);

        Log.Information("****MiddleWare**** Outgoing response: {StatusCode} {Body}", context.Response.StatusCode, responseBodyText);

        await responseBody.CopyToAsync(originalBodyStream);
    }
}
