using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using QuizAPI.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

string connectionString;

if (!string.IsNullOrEmpty(databaseUrl))
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');

    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.Trim('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DevConnection");
}

builder.Services.AddDbContext<QuizDbContext>(options =>
    options.UseNpgsql(connectionString));

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow both Vite dev server (5173) and the old CRA port (3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",   // Vite (React frontend)
                "http://localhost:3000",    // fallback / CRA
                "https://quiz-app-azure-mu-29.vercel.app" // Deployed frontend on Vercel
              )
              .AllowAnyHeader()
              .AllowAnyMethod();

        //policy.AllowAnyOrigin()
        //    .AllowAnyHeader()
        //    .AllowAnyMethod();
    });
});

var app = builder.Build();



//var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
//app.Urls.Add($"http://*:{port}");

app.UseRouting();

// IMPORTANT: UseCors must come BEFORE UseAuthorization and MapControllers
app.UseCors("AllowFrontend");

app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<QuizDbContext>();
    db.Database.Migrate();
}

app.Run();
