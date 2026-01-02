package com.designer.marketplace.startup;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DbColumnInspectorRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    private final List<String[]> columnsToCheck = Arrays.asList(
            new String[] { "users", "skills" },
            new String[] { "users", "certifications" },
            new String[] { "users", "languages" },
            new String[] { "jobs", "benefits" },
            new String[] { "jobs", "perks" },
            new String[] { "jobs", "location" },
            new String[] { "projects", "required_skills" }
    );

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("DbColumnInspectorRunner starting — will inspect {} columns", columnsToCheck.size());

        for (String[] pair : columnsToCheck) {
            String table = pair[0];
            String column = pair[1];
            try {
                String udtSql = "SELECT udt_name FROM information_schema.columns WHERE table_name = ? AND column_name = ?";
                String udt = jdbcTemplate.queryForObject(udtSql, new Object[] { table, column }, String.class);
                log.info("columnInfo: {}.{} udt_name={}", table, column, udt);
            } catch (Exception e) {
                log.warn("columnInfo: {}.{} udt_name query failed: {}", table, column, e.getMessage());
            }

            try {
                String pgTypeSql = String.format("SELECT pg_typeof(%s) FROM %s WHERE %s IS NOT NULL LIMIT 1", column, table, column);
                String pgType = jdbcTemplate.queryForObject(pgTypeSql, String.class);
                log.info("columnInfo: {}.{} pg_typeof_sample={}", table, column, pgType);
            } catch (Exception e) {
                log.warn("columnInfo: {}.{} pg_typeof query failed: {}", table, column, e.getMessage());
            }

            try {
                String encodeSql = String.format("SELECT encode(%s, 'hex') FROM %s WHERE %s IS NOT NULL LIMIT 1", column, table, column);
                String sampleHex = jdbcTemplate.queryForObject(encodeSql, String.class);
                log.info("columnInfo: {}.{} sample_hex={} (len={})", table, column, sampleHex, sampleHex != null ? sampleHex.length() : 0);
            } catch (Exception e) {
                log.warn("columnInfo: {}.{} sample_hex query failed: {}", table, column, e.getMessage());
            }

            // Find up to 10 rows where the runtime type is actually bytea (these are the problematic rows)
            try {
                String idsSql = String.format("SELECT id FROM %s WHERE pg_typeof(%s) = 'bytea'::regtype LIMIT 10", table, column);
                java.util.List<java.lang.Long> ids = jdbcTemplate.queryForList(idsSql, Long.class);
                if (ids != null && !ids.isEmpty()) {
                    log.warn("columnInfo: {}.{} found {} rows with bytea type (sample ids={})", table, column, ids.size(), ids);
                } else {
                    log.info("columnInfo: {}.{} no rows with pg_typeof=bytea found (sample check)", table, column);
                }
            } catch (Exception e) {
                log.warn("columnInfo: {}.{} pg_typeof(bytea) rows query failed: {}", table, column, e.getMessage());
            }
        }

        log.info("DbColumnInspectorRunner finished");
    }
}
