package com.designer.marketplace.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AdminDebugController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/internal/db/column-info")
    public Map<String, Object> columnInfo(@RequestParam String table, @RequestParam String column) {
        Map<String, Object> out = new HashMap<>();
        String udtSql = "SELECT udt_name FROM information_schema.columns WHERE table_name = ? AND column_name = ?";
        try {
            String udt = jdbcTemplate.queryForObject(udtSql, new Object[] { table, column }, String.class);
            out.put("udt_name", udt);
        } catch (Exception e) {
            out.put("udt_name_error", e.getMessage());
        }

        try {
            String pgTypeSql = String.format("SELECT pg_typeof(%s) FROM %s LIMIT 1", column, table);
            String pgType = jdbcTemplate.queryForObject(pgTypeSql, String.class);
            out.put("pg_typeof_sample", pgType);
        } catch (Exception e) {
            out.put("pg_typeof_error", e.getMessage());
        }

        try {
            String encodeSql = String.format("SELECT encode(%s, 'hex') FROM %s WHERE %s IS NOT NULL LIMIT 1", column, table, column);
            String sampleHex = jdbcTemplate.queryForObject(encodeSql, String.class);
            out.put("sample_hex", sampleHex);
        } catch (Exception e) {
            out.put("sample_hex_error", e.getMessage());
        }

        return out;
    }
}
