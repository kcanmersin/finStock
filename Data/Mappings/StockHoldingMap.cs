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

            builder.HasOne(sh => sh.Portfolio)
                .WithMany(p => p.StockHoldings)
                .HasForeignKey(sh => sh.PortfolioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(sh => sh.Stock)
                .WithMany(s => s.StockHoldings)
                .HasForeignKey(sh => sh.StockId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable("StockHoldings");
        }
    }
}
