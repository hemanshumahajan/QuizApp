using QuizAPI.Models;

namespace QuizAPI.Data
{
    public static class DbSeeder
    {
        public static void Seed(QuizDbContext context)
        {
            if(context.Questions.Any())
                return;

            var questions = new List<Question>
            {
                // ================= C# =================
                new Question { QnInWords="What is C#?", Option1="Programming Language", Option2="Database", Option3="OS", Option4="Browser", Answer=1 },
                new Question { QnInWords="CLR stands for?", Option1="Common Language Runtime", Option2="Code Language Run", Option3="Common Logic Runtime", Option4="None", Answer=1 },
                new Question { QnInWords="What is .NET?", Option1="Framework", Option2="Language", Option3="Database", Option4="Protocol", Answer=1 },
                new Question { QnInWords="Value types are stored in?", Option1="Stack", Option2="Heap", Option3="Disk", Option4="Cache", Answer=1 },
                new Question { QnInWords="Reference types stored in?", Option1="Heap", Option2="Stack", Option3="Cache", Option4="Register", Answer=1 },
                new Question { QnInWords="Which keyword is used for inheritance?", Option1=":", Option2="extends", Option3="inherits", Option4="base", Answer=1 },
                new Question { QnInWords="What is polymorphism?", Option1="Many forms", Option2="One form", Option3="No form", Option4="Static form", Answer=1 },
                new Question { QnInWords="What is encapsulation?", Option1="Data hiding", Option2="Inheritance", Option3="Binding", Option4="Casting", Answer=1 },
                new Question { QnInWords="What is abstraction?", Option1="Hide implementation", Option2="Show everything", Option3="Copy class", Option4="Delete class", Answer=1 },
                new Question { QnInWords="Interface keyword?", Option1="interface", Option2="class", Option3="struct", Option4="impl", Answer=1 },

                // ================= SOLID =================
                new Question { QnInWords="S in SOLID?", Option1="Single Responsibility", Option2="Simple", Option3="Solidify", Option4="Strong", Answer=1 },
                new Question { QnInWords="O in SOLID?", Option1="Open/Closed", Option2="Object", Option3="Optional", Option4="Outer", Answer=1 },
                new Question { QnInWords="L in SOLID?", Option1="Liskov Substitution", Option2="Logic", Option3="Link", Option4="Layer", Answer=1 },
                new Question { QnInWords="I in SOLID?", Option1="Interface Segregation", Option2="Integration", Option3="Internal", Option4="Instance", Answer=1 },
                new Question { QnInWords="D in SOLID?", Option1="Dependency Inversion", Option2="Design", Option3="Data", Option4="Direct", Answer=1 },
                new Question { QnInWords="SRP means?", Option1="One reason to change", Option2="Multiple reasons", Option3="No change", Option4="Random", Answer=1 },
                new Question { QnInWords="OCP principle?", Option1="Open for extension", Option2="Close everything", Option3="No extension", Option4="Only modify", Answer=1 },
                new Question { QnInWords="LSP ensures?", Option1="Subclass replaceable", Option2="No subclass", Option3="Only base class", Option4="Random", Answer=1 },
                new Question { QnInWords="ISP avoids?", Option1="Fat interfaces", Option2="Small interfaces", Option3="Clean code", Option4="Testing", Answer=1 },
                new Question { QnInWords="DIP promotes?", Option1="Abstraction", Option2="Concrete classes", Option3="Static code", Option4="Hard coding", Answer=1 },

                // ================= DESIGN PATTERNS =================
                new Question { QnInWords="Singleton ensures?", Option1="Single instance", Option2="Multiple objects", Option3="No object", Option4="Static class", Answer=1 },
                new Question { QnInWords="Factory pattern creates?", Option1="Objects", Option2="Methods", Option3="Variables", Option4="Interfaces", Answer=1 },
                new Question { QnInWords="Observer pattern is?", Option1="Behavioral", Option2="Structural", Option3="Creational", Option4="None", Answer=1 },
                new Question { QnInWords="Decorator pattern?", Option1="Adds behavior", Option2="Removes behavior", Option3="Deletes class", Option4="None", Answer=1 },
                new Question { QnInWords="Strategy pattern?", Option1="Algorithm selection", Option2="Data storage", Option3="UI design", Option4="None", Answer=1 },
                new Question { QnInWords="MVC stands for?", Option1="Model View Controller", Option2="Main View Code", Option3="Model Version Control", Option4="None", Answer=1 },
                new Question { QnInWords="Repository pattern?", Option1="Data access layer", Option2="UI", Option3="Logic", Option4="Cache", Answer=1 },
                new Question { QnInWords="Unit of Work?", Option1="Transaction management", Option2="UI", Option3="Logging", Option4="Routing", Answer=1 },
                new Question { QnInWords="Adapter pattern?", Option1="Interface conversion", Option2="Data storage", Option3="UI", Option4="None", Answer=1 },
                new Question { QnInWords="Builder pattern?", Option1="Step by step object", Option2="Direct object", Option3="Delete object", Option4="None", Answer=1 },

                // ================= MIX =================
                new Question { QnInWords="Garbage Collection in C#?", Option1="Automatic memory management", Option2="Manual", Option3="None", Option4="Static", Answer=1 },
                new Question { QnInWords="Async keyword?", Option1="Asynchronous programming", Option2="Sync", Option3="Blocking", Option4="Loop", Answer=1 },
                new Question { QnInWords="Task represents?", Option1="Async operation", Option2="Thread only", Option3="Variable", Option4="None", Answer=1 },
                new Question { QnInWords="LINQ used for?", Option1="Querying data", Option2="UI", Option3="Routing", Option4="None", Answer=1 },
                new Question { QnInWords="Dependency Injection?", Option1="Loose coupling", Option2="Tight coupling", Option3="Hard coding", Option4="None", Answer=1 },
                new Question { QnInWords="Middleware in ASP.NET?", Option1="Request pipeline", Option2="Database", Option3="UI", Option4="None", Answer=1 },
                new Question { QnInWords="Entity Framework?", Option1="ORM", Option2="UI tool", Option3="Compiler", Option4="None", Answer=1 },
                new Question { QnInWords="Migration in EF?", Option1="DB schema change", Option2="UI change", Option3="Logic change", Option4="None", Answer=1 },
                new Question { QnInWords="Primary key?", Option1="Unique identifier", Option2="Duplicate", Option3="Optional", Option4="None", Answer=1 },
                new Question { QnInWords="Foreign key?", Option1="Relation", Option2="Primary", Option3="Index", Option4="None", Answer=1 },

                // ================= EXTRA =================
                new Question { QnInWords="Encapsulation achieved using?", Option1="Access modifiers", Option2="Loops", Option3="Conditions", Option4="None", Answer=1 },
                new Question { QnInWords="Abstract class can?", Option1="Have methods", Option2="No methods", Option3="Only static", Option4="None", Answer=1 },
                new Question { QnInWords="Interface supports?", Option1="Multiple inheritance", Option2="Single", Option3="None", Option4="Static", Answer=1 },
                new Question { QnInWords="Sealed class?", Option1="Cannot inherit", Option2="Can inherit", Option3="Static", Option4="None", Answer=1 },
                new Question { QnInWords="Extension methods?", Option1="Add methods", Option2="Delete methods", Option3="Static only", Option4="None", Answer=1 }
            };

            context.Questions.AddRange(questions);
            context.SaveChanges();
        }
    }
}