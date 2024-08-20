using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;

public class LoggingActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var request = context.HttpContext.Request;
        var routeData = context.ActionDescriptor.RouteValues;

        Log.Information("****ActionFilter**** Request for {Method} {Path} from {IPAddress} with data {@Data}",
            request.Method,
            request.Path,
            context.HttpContext.Connection.RemoteIpAddress,
            context.ActionArguments);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        var response = context.HttpContext.Response;
        Log.Information("****ActionFilter**** Response from {StatusCode} with data {@Data}",
            response.StatusCode,
            context.Result);
    }
}
