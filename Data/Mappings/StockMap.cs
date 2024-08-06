using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Entity.Entities.Stock;

namespace Data.Mappings
{
    public class StockMap : IEntityTypeConfiguration<Stock>
    {
        public void Configure(EntityTypeBuilder<Stock> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Symbol)
                .IsRequired()
                .HasMaxLength(10);

            //builder.Property(s => s.Name)
            //    .IsRequired()
            //    .HasMaxLength(100);

            // builder.HasMany(s => s.StockHoldings)
            //     .WithOne(sh => sh.Stock)
            //     .HasForeignKey(sh => sh.StockId)
            //     .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable("Stocks");
        }
    }
}
