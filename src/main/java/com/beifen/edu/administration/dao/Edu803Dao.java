package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu803;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Configuration
public interface Edu803Dao extends JpaRepository<Edu803, Long>, JpaSpecificationExecutor<Edu803> {
    //根据802id查询List
    @Query(value = "select * from edu803 where EDU802_ID = ?1 ORDER BY CHECK_OR_RADIO_INDEX",nativeQuery = true)
    List<Edu803> findByEdu802Id(String edu802Id);
}
