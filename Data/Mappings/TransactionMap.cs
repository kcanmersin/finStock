using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Entity.Entities.Stock;

namespace Data.Mappings
{
    public class TransactionMap : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Amount)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(t => t.TransactionDate)
                .IsRequired();

            builder.Property(t => t.Type)
                .IsRequired();

            builder.Property(t => t.Description)
                .HasMaxLength(500);

            builder.HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.ToTable("Transactions");
        }
    }
}
