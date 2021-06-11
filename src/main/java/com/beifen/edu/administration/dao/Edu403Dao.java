package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu403;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu403Dao extends JpaRepository<Edu403, Long>, JpaSpecificationExecutor<Edu403> {

    @Query(value = "SELECT * FROM EDU403 where xnid = ?1 ORDER BY ksz",nativeQuery = true)
    List<Edu403> selectAll(String id);
}
