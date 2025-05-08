const Person = ({person, onDelete}) => {
    return(
        <p>
        {person.name} {person.number}
        <button onClick={() => onDelete(person.id)}>Delete</button>
        </p>
    )
}

export default Person