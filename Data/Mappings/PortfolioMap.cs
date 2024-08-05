using Entity.Entities.Stock;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Mappings
{
    public class PortfolioMap : IEntityTypeConfiguration<Portfolio>
    {
        public void Configure(EntityTypeBuilder<Portfolio> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.HasOne(p => p.AppUser)
                .WithOne(a => a.Portfolio)
                .HasForeignKey<Portfolio>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.StockHoldings)
                .WithOne(sh => sh.Portfolio)
                .HasForeignKey(sh => sh.PortfolioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.ToTable("Portfolios");
        }
    }
}
