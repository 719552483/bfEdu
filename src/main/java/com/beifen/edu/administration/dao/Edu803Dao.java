package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu803;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
public interface Edu803Dao extends JpaRepository<Edu803, Long>, JpaSpecificationExecutor<Edu803> {
    //根据802id查询List
    @Query(value = "select * from edu803 where EDU802_ID = ?1 ORDER BY CHECK_OR_RADIO_INDEX",nativeQuery = true)
    List<Edu803> findByEdu802Id(String edu802Id);

    //根据802id查询sum
    @Query(value = "select sum(num) from edu803 where EDU802_ID = ?1 ORDER BY CHECK_OR_RADIO_INDEX",nativeQuery = true)
    int findSumByEdu802Id(String edu802Id);

    //根据801Id删除
    @Transactional
    @Modifying
    @Query(value = "delete from edu803 where EDU802_ID in (select EDU802_ID from edu802 where EDU801_ID = ?1) ",nativeQuery = true)
    void deleteByEdu801Id(String edu801Id);
}
