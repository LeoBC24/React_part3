const PersonForm = ({ newName, handleAddName, newNumber, handleAddNumber, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:
        <input type="text" value={newName} onChange={handleAddName} />
      </div>
      <div>
        number:
        <input type="tel" value={newNumber} onChange={handleAddNumber} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

export default PersonForm