import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./GridLayout.scss";

function chunkerrr(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function GridLayout({ data }) {
  const chunks = chunkerrr(data, 5);

  return (
    <Container>
      {/* iterate over each chunk to turn into row */}
      {chunks.map((chunk, rowIndex) => (
        // current index of chunk in array, assign key to each rendered row
        <Row className="grid-row" key={rowIndex}>
          {/* iterate over each item in a chunk to turn into a col */}
          {chunk.map((item, colIndex) => (
            <Col className="grid-col" key={`${rowIndex}-${colIndex}`}>
              {item.name}{" "}
            </Col>
          ))}
          {chunk.length < 5 &&
            Array.from({ length: 5 - chunk.length }).map((_, index) => (
              <Col
                className="grid-col"
                key={`empty-${rowIndex}-${index}`}
              ></Col>
            ))}
        </Row>
      ))}
    </Container>
  );
}

export default GridLayout;
