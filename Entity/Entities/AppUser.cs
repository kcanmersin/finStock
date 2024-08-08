using Core.Entities;
using Entity.Entities.Stock;
using Microsoft.AspNetCore.Identity;

namespace Entity.Entities
{
    public class AppUser : IdentityUser<Guid>, IEntityBase
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public Guid ImageId { get; set; } = Guid.Parse("F71F4B9A-AA60-461D-B398-DE31001BF214");
        
        // Guid.Parse("4084c97a-2aa1-4675-b519-69f6fe410633");
        public Image Image { get; set; }


         public decimal Balance { get; set; }  = 0;
             //zero

    // Navigation properties
        public virtual ICollection<StockHolding> StockHoldings { get; set; }

    public virtual List<Transaction> Transactions { get; set; }




    }
}
