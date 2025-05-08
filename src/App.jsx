import { useState, useEffect } from "react";
import personService from "./services/personService";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    personService
      .getAll()
      .then((data) => {
        setPersons(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  const handleAddName = (event) => {
    setNewName(event.target.value);
  };

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const person = persons.find((p) => p.name === newName);

    if (person) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook. Do you want to update their number?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...person, number: newNumber };

        personService
          .update(person.id, updatedPerson)
          .then((updated) => {
            setPersons(persons.map((p) => (p.id === updated.id ? updated : p)));
            setNewName("");
            setNewNumber("");
            showNotification(`${newName}'s number updated successfully`);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              showNotification(`${newName} was already deleted`, "error");
            } else {
              showNotification(
                "There was an error updating the person",
                "error"
              );
            }
            console.error("Error updating person:", error);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personService
        .create(newPerson)
        .then((addedPerson) => {
          setPersons(persons.concat(addedPerson));
          setNewName("");
          setNewNumber("");
          showNotification(`${newName} added successfully`);
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.error || "There was an error adding the person";
          showNotification(errorMessage, "error");
          console.error("Error adding person:", error);
        });
        
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (personToDelete) {
      if (
        window.confirm(
          `Are you sure you want to delete ${personToDelete.name}?`
        )
      ) {
        personService
          .remove(id)
          .then(() => {
            setPersons(persons.filter((person) => person.id !== id));
            showNotification(`${personToDelete.name} deleted successfully`);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              showNotification(
                `${personToDelete.name} already deleted`,
                "error"
              );
            } else {
              showNotification(
                "There was an error deleting the person",
                "error"
              );
            }
            console.error("Error deleting person:", error);
          });
      }
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <h2>Phonebook</h2>

      {error && (
        <div style={{ color: "red" }}>
          Could not load data. Backend may be offline.
        </div>
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleAddName={handleAddName}
        handleAddNumber={handleAddNumber}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <PersonList persons={filteredPersons} onDelete={handleDelete} />
    </section>
  );
};

export default App;
