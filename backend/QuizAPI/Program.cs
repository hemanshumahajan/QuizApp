using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using QuizAPI.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<QuizDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DevConnection")));

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
    });
});

var app = builder.Build();

// IMPORTANT: UseCors must come BEFORE UseAuthorization and MapControllers
app.UseCors("AllowFrontend");

var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
app.Urls.Add($"http://*:{port}");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
