import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { SearchControl, Spinner, Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

function useDebounce(value, delay) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}

export default function PageSearchPanel({ onAdd }) {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const debouncedSearch = useDebounce(search, 300);

	const urlDomain = new URL(window.location.href).origin;

	useEffect(() => {
		if (!debouncedSearch) {
			setResults([]);
			return;
		}
		setIsLoading(true);
		apiFetch({
			path: `/wp/v2/pages?search=${encodeURIComponent(debouncedSearch)}&per_page=10&_fields=id,title,link`,
		})
			.then((pages) => { setResults(pages); setIsLoading(false); })
			.catch(() => setIsLoading(false));
	}, [debouncedSearch]);

	return (
		<>
			<SearchControl
				label={__('Search pages')}
				value={search}
				onChange={setSearch}
			/>
			{isLoading && <Spinner />}
			{results.map((page) => (
				<Button
					key={page.id}
					variant="tertiary"
					onClick={() => { onAdd(page); setSearch(''); setResults([]); }}
					style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '2px' }}
				>
					{page.title.rendered} ({page.link.replace(urlDomain, '')})
				</Button>
			))}
		</>
	);
}
