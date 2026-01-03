package com.designer.marketplace.config;

import java.io.Serializable;
import java.sql.Array;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

/**
 * Custom Hibernate UserType for PostgreSQL text[] arrays
 * Handles bidirectional conversion between database text[] and Java List<String>
 */
public class TextArrayType implements UserType<List<String>> {

    @Override
    public int getSqlType() {
        return Types.ARRAY;
    }

    @Override
    public Class<List<String>> returnedClass() {
        return (Class<List<String>>) (Class) List.class;
    }

    @Override
    public boolean equals(List<String> x, List<String> y) {
        if (x == null) {
            return y == null;
        }
        return x.equals(y);
    }

    @Override
    public int hashCode(List<String> x) {
        return x == null ? 0 : x.hashCode();
    }

    @Override
    public List<String> nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session, Object owner)
            throws SQLException {
        Array array = rs.getArray(position);
        if (array == null) {
            return new ArrayList<>();
        }
        
        try {
            String[] javaArray = (String[]) array.getArray();
            if (javaArray == null) {
                return new ArrayList<>();
            }
            return List.of(javaArray);
        } finally {
            array.free();
        }
    }

    @Override
    public void nullSafeSet(PreparedStatement st, List<String> value, int index, SharedSessionContractImplementor session)
            throws SQLException {
        if (value == null || value.isEmpty()) {
            st.setNull(index, Types.ARRAY);
        } else {
            Array array = session.getJdbcCoordinator()
                    .getLogicalConnection()
                    .getPhysicalConnection()
                    .createArrayOf("text", value.toArray(new String[0]));
            st.setArray(index, array);
        }
    }

    @Override
    public List<String> deepCopy(List<String> value) {
        return value == null ? null : new ArrayList<>(value);
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public Serializable disassemble(List<String> value) {
        return (Serializable) deepCopy(value);
    }

    @Override
    public List<String> assemble(Serializable cached, Object owner) {
        return deepCopy((List<String>) cached);
    }

    @Override
    public List<String> replace(List<String> detached, List<String> managed, Object owner) {
        return deepCopy(detached);
    }
}
