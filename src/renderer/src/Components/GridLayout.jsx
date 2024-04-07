import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./GridLayout.scss";

function chunkArray(array, chunkSize) {
  if (!Array.isArray(array)) {
    return [];
  }
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function GridLayout({ data, onItemSelect, renderCell }) {
  const chunks = chunkArray(data, 5);

  return (
    <Container style={{ color: "white" }}>
      {chunks.map((chunk, rowIndex) => (
        <Row className="grid-row" key={rowIndex}>
          {chunk.map((item, colIndex) =>
            renderCell ? (
              <React.Fragment key={`${rowIndex}-${colIndex}`}>
                {renderCell(item)}
              </React.Fragment>
            ) : (
              <Col
                className="grid-col d-flex align-items-center justify-content-center grid-item"
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onItemSelect(item)}
              >
                {item.name}
              </Col>
            )
          )}
          {rowIndex === chunks.length - 1 &&
            Array.from({ length: 5 - chunk.length }, (_, index) => (
              <Col
                className="grid-col d-flex align-items-center justify-content-center invisible"
                key={`placeholder-${rowIndex}-${index}`}
              >
                &nbsp;
              </Col>
            ))}
        </Row>
      ))}
    </Container>
  );
}

export default GridLayout;
