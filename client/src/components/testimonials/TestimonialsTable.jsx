function TestimonialsTable({
  testimonials,
  loading,
  pagination,
  onPageChange,
}) {
  return (
    <div>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>التقييم</th>
              <th>النص</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((item) => (
              <tr key={item.id}>
                <td>{item.author_name}</td>
                <td>{item.rating}</td>
                <td>{item.text}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
