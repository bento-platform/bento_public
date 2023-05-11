import Filter from './Filter';

// ideally:
// - should not permit you to make multiple queries on the same key
// - should be able to remove a particular filter

const Filters = ({ filters, form, querySections }) => {
  return filters.map((f) => <Filter key={f.index} filter={f} form={form} querySections={querySections} />);
};

export default Filters;
