package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu501;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


@Configuration
public interface Edu501Dao extends JpaRepository<Edu501, Long>, JpaSpecificationExecutor<Edu501> {

    // 根据id删除教室
    @Transactional
    @Modifying
    @Query(value = "delete from edu501 where Edu501_ID =?1", nativeQuery = true)
    void removeSite(String edu500id);

}
