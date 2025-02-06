import React, { useState } from "react";
import { Button, Form, Row, Col, Card, Container } from "react-bootstrap";

// Sample data for items being sold (replace with actual data or API calls)
const itemsData = [
  { id: 1, name: "Laptop", price: 50000, category: "Electronics", vendor: "Vendor A" },
  { id: 2, name: "Table", price: 3000, category: "Furniture", vendor: "Vendor B" },
  { id: 3, name: "Chair", price: 1000, category: "Furniture", vendor: "Vendor C" },
  { id: 4, name: "Mobile", price: 20000, category: "Electronics", vendor: "Vendor D" },
  { id: 5, name: "Book", price: 500, category: "Stationery", vendor: "Vendor E" },
  { id: 6, name: "Pen", price: 50, category: "Stationery", vendor: "Vendor F" },
];

const categories = ["Electronics", "Furniture", "Stationery"];

const SearchItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState(itemsData);

  // Handle search functionality
  const handleSearch = () => {
    let results = itemsData;

    // Filter based on categories
    if (selectedCategories.length > 0) {
      results = results.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    // Filter based on search query
    if (searchQuery.trim() !== "") {
      results = results.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(results);
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Render the list of filtered items
  const renderItems = () => {
    return filteredItems.map((item) => (
      <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
        <Card className="h-100">
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>
              <strong>Price:</strong> ₹{item.price}
              <br />
              <strong>Vendor:</strong> {item.vendor}
              <br />
              <strong>Category:</strong> {item.category}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="primary"
              onClick={() => handleItemClick(item.id)}
              className="w-100"
            >
              View Item
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    ));
  };

  // Handle item click to open its page
  const handleItemClick = (itemId) => {
    alert(`Navigate to the details page of item with ID: ${itemId}`);
    // You can navigate to the item's page using a router (e.g., React Router)
    // Example: history.push(`/items/${itemId}`);
  };

  return (
    <Container className="search-items-page py-4">
      <h1 className="mb-4 text-center">Items for Sale</h1>

      {/* Search Bar */}
      <Row className="mb-3">
        <Col xs={12} sm={8}>
          <Form.Control
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={4} className="mt-2 mt-sm-0">
          <Button variant="success" className="w-100" onClick={handleSearch}>
            Search
          </Button>
        </Col>
      </Row>

      {/* Category Filters */}
      <Row className="mb-4">
        <Col>
          <h5>Filter by Categories</h5>
          {categories.map((category) => (
            <Form.Check
              key={category}
              inline
              label={category}
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="mb-2"
            />
          ))}
        </Col>
      </Row>

      {/* Display Items */}
      <Row>
        {filteredItems.length > 0 ? (
          renderItems()
        ) : (
          <Col>
            <p className="text-center text-muted">
              No items found matching your criteria.
            </p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SearchItems;
