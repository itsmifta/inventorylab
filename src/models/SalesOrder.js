// SalesOrder.js - Model for Sales Orders
class SalesOrder {
  constructor(id, orderDate, customer, totalAmount, products, status = 'Pending') {
    this.id = id;
    this.orderDate = orderDate;
    this.customer = customer;
    this.totalAmount = totalAmount;
    this.products = products; // Array of products with productId, name, quantity, pricePerUnit
    this.status = status; // Pending, Completed, Cancelled
  }
}

export default SalesOrder;