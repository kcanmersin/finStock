FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /source

COPY ["finance.sln", "./"]
COPY ["API/API.csproj", "API/"]
COPY ["Data/Data.csproj", "Data/"]
COPY ["Entity/Entity.csproj", "Entity/"]
COPY ["Service/Service.csproj", "Service/"]
COPY ["Core/Core.csproj", "Core/"]
RUN dotnet restore "finance.sln"

COPY ["API/", "API/"]







COPY ["Data/", "Data/"]
COPY ["Entity/", "Entity/"]
COPY ["Service/", "Service/"]
COPY ["Core/", "Core/"]
RUN dotnet build "API/API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "API/API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
EXPOSE 443




ENTRYPOINT ["dotnet", "API.dll"]
