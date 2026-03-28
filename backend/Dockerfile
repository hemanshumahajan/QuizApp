FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app

COPY --from=build /app/out .

# ✅ ADD THIS LINE (VERY IMPORTANT)
COPY --from=build /app/QuizAPI/Images ./Images

EXPOSE 10000

ENTRYPOINT ["dotnet", "QuizAPI.dll"]