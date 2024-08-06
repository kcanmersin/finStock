using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Entity.Entities.Stock;

namespace Data.Mappings
{
    public class StockHoldingMap : IEntityTypeConfiguration<StockHolding>
    {
        public void Configure(EntityTypeBuilder<StockHolding> builder)
        {
            builder.HasKey(sh => sh.Id);

            builder.Property(sh => sh.Quantity)
                .IsRequired();

            builder.Property(sh => sh.PurchasePrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            // Linking StockHolding directly to AppUser
            builder.HasOne(sh => sh.User)
                .WithMany(u => u.StockHoldings)
                .HasForeignKey(sh => sh.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Using a simple string for StockSymbol, no foreign key to a Stock entity
            builder.Property(sh => sh.StockSymbol)
                .IsRequired();

            builder.ToTable("StockHoldings");
        }
    }
}
