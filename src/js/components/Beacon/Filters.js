import Filter from './Filter';

// ideally:
// - should not permit you to make multiple queries on the same key
// - should be able to remove a particular filter

const Filters = ({ filters, form, querySections }) => {
  return (
    <div style={{minWidth: "500px", display: "flex", flexDirection: "column", padding: 0}}>
      {filters.map((f) => <Filter key={f.index} filter={f} form={form} querySections={querySections} />)}
    </div>
  ) 
};

export default Filters;