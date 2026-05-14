// src/ShoppingListWithImmer.jsx
import { useState } from "react";
import { useImmer } from "use-immer";
import "./ShoppingListWithImmer.css";

const MAX_QUANTITY = 50;

export default function ShoppingListWithImmer() {
  const [shoppingList, updateShoppingList] = useImmer([
    {
      id: 1,
      name: "Apples",
      quantity: 3,
      details: {
        category: "Fruit",
        notes: "Buy fresh red apples",
      },
    },
    {
      id: 2,
      name: "Milk",
      quantity: 1,
      details: {
        category: "Dairy",
        notes: "Get low-fat milk",
      },
    },
  ]);

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function addItem() {
    const trimmedName = itemName.trim();
    const trimmedCategory = category.trim();
    const trimmedNotes = notes.trim();
    const numericQuantity = Number(quantity);

    if (trimmedName === "") {
      setErrorMessage("Please enter an item name.");
      return;
    }

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      setErrorMessage("Quantity must be greater than zero.");
      return;
    }

    if (numericQuantity > MAX_QUANTITY) {
      setErrorMessage(`Quantity cannot be greater than ${MAX_QUANTITY}.`);
      return;
    }

    const itemExists = shoppingList.some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (itemExists) {
      setErrorMessage("Item already exists.");
      return;
    }

    updateShoppingList((draft) => {
      draft.push({
        id: Date.now(),
        name: trimmedName,
        quantity: numericQuantity,
        details: {
          category: trimmedCategory || "Uncategorized",
          notes: trimmedNotes || "No notes added",
        },
      });
    });

    setItemName("");
    setQuantity(1);
    setCategory("");
    setNotes("");
    setErrorMessage("");
  }

  function updateItem(itemId) {
    updateShoppingList((draft) => {
      const item = draft.find((item) => item.id === itemId);

      if (item && item.quantity < MAX_QUANTITY) {
        item.quantity += 1;
        item.details.notes = `Updated quantity to ${item.quantity}`;
      }

      if (item && item.quantity >= MAX_QUANTITY) {
        item.details.notes = `Maximum quantity of ${MAX_QUANTITY} reached.`;
      }
    });
  }

  function updateItemNotes(itemId, newNotes) {
    updateShoppingList((draft) => {
      const item = draft.find((item) => item.id === itemId);

      if (item) {
        item.details.notes = newNotes.trim() || "No notes added";
      }
    });
  }

  function removeItem(itemId) {
    updateShoppingList((draft) => {
      const itemIndex = draft.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        draft.splice(itemIndex, 1);
      }
    });
  }

  return (
    <div className="shopping-container">
      <h1>Shopping List with Immer</h1>

      <div className="shopping-form">
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(event) => {
            setItemName(event.target.value);
            setErrorMessage("");
          }}
        />

        <input
          type="number"
          min="1"
          max={MAX_QUANTITY}
          placeholder="Quantity"
          value={quantity}
          onChange={(event) => {
            setQuantity(event.target.value);
            setErrorMessage("");
          }}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />

        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        <button onClick={addItem}>Add Item</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="shopping-list">
        {shoppingList.length === 0 ? (
          <p className="empty-message">No items in the shopping list.</p>
        ) : (
          shoppingList.map((item) => (
            <div key={item.id} className="shopping-card">
              <div className="item-info">
                <h2>{item.name}</h2>

                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>

                <p>
                  <strong>Category:</strong> {item.details.category}
                </p>

                <p>
                  <strong>Notes:</strong> {item.details.notes}
                </p>
              </div>

              <div className="item-actions">
                <button onClick={() => updateItem(item.id)}>
                  Increase Quantity
                </button>

                <button
                  onClick={() =>
                    updateItemNotes(
                      item.id,
                      prompt("Enter new notes:", item.details.notes) || ""
                    )
                  }
                >
                  Update Notes
                </button>

                <button
                  className="delete-button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
