import type { ContentMap, REProperty } from '@/lib/types';

export default function REProperties({
  properties,
  content,
}: {
  properties: REProperty[];
  content: ContentMap;
}) {
  return (
    <section className="re-properties" id="properties">
      <div className="re-container">
        <div className="re-section-header">
          <span className="re-eyebrow">
            {content.re_properties_eyebrow || 'Our Portfolio'}
          </span>
          <h2 className="re-section-heading">
            {content.re_properties_heading || 'Featured Properties'}
          </h2>
          <p className="re-section-subheading">
            {content.re_properties_subheading}
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="re-properties__grid">
            {properties.map((property) => (
              <div className="re-prop-card" key={property.id}>
                <div className="re-prop-card__image">
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="re-prop-card__placeholder">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                  {property.type && (
                    <span className="re-prop-card__badge">{property.type}</span>
                  )}
                </div>
                <div className="re-prop-card__body">
                  <h3 className="re-prop-card__title">{property.title}</h3>
                  <div className="re-prop-card__location">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{property.location}</span>
                  </div>
                  <div className="re-prop-card__price">{property.price}</div>
                  <div className="re-prop-card__meta">
                    {property.area_sqft > 0 && (
                      <span>
                        <strong>{property.area_sqft.toLocaleString()}</strong>{' '}
                        sqft
                      </span>
                    )}
                    {property.bedrooms > 0 && (
                      <span>
                        <strong>{property.bedrooms}</strong>{' '}
                        {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                      </span>
                    )}
                    {property.bathrooms > 0 && (
                      <span>
                        <strong>{property.bathrooms}</strong>{' '}
                        {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="re-properties__empty">
            Properties are being updated. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
