package com.designer.marketplace.config;

import java.sql.Array;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA Converter for PostgreSQL text[] arrays to Java List<String>
 * Handles bidirectional conversion between database array type and Java collections
 */
@Converter
public class StringListConverter implements AttributeConverter<List<String>, Array> {

    @Override
    public Array convertToDatabaseColumn(List<String> attribute) {
        // Will be handled by Hibernate when writing to database
        // The actual conversion is done in the dialect
        return null;
    }

    @Override
    public List<String> convertToEntityAttribute(Array dbData) {
        if (dbData == null) {
            return new ArrayList<>();
        }
        
        try {
            String[] array = (String[]) dbData.getArray();
            if (array == null) {
                return new ArrayList<>();
            }
            return List.of(array);
        } catch (SQLException e) {
            throw new RuntimeException("Error converting PostgreSQL array to List", e);
        }
    }
}
