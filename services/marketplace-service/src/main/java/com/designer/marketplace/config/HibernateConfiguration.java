package com.designer.marketplace.config;

import org.hibernate.boot.MetadataBuilder;
import org.hibernate.boot.spi.MetadataBuilderContributor;
import org.springframework.stereotype.Component;

/**
 * Hibernate configuration to register custom types
 * Registers the TextArrayType for PostgreSQL text[] array mapping
 */
@Component
public class HibernateConfiguration implements MetadataBuilderContributor {

    @Override
    public void contribute(MetadataBuilder metadataBuilder) {
        // Register the custom type for PostgreSQL text[] arrays
        metadataBuilder.applyBasicType(new TextArrayType(), "text_array");
    }
}
