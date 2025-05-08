const Filter = ({filter, onFilterChange}) => {
    return (
        <div>Filter shown with
            <input 
                type='text'
                placeholder="Search for a name"
                value={filter}
                onChange={onFilterChange}
            />
        </div>
        )
    }

export default Filter